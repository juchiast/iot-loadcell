use futures::future;
use futures::prelude::*;
use warp::filters::ws::Message;
use warp::filters::ws::WebSocket;
use warp::reject::Rejection;
use warp::Filter;

pub async fn ws_handle(name: String, mut ws: WebSocket) {
    let mut path = std::path::PathBuf::new();
    path.push("/dev/");
    path.push(&name);
    let mut tty = match crate::tty::TTY::open(path).await {
        Err(_) => {
            ws.send(Message::text(
                serde_json::to_string(&serde_json::json!({"error": "Can't open serial"})).unwrap(),
            ))
            .await
            .ok();
            ws.close().await.ok();
            return;
        }
        Ok(tty) => tty,
    };

    let (mut ws_tx, mut ws_rx) = ws.split();

    let mut lines = tty.lines;
    let mut writer = tty.writer;

    let read_tty = tokio::spawn(async move {
        while let Some(line) = lines.next().await {
            if line == "close" {
                break;
            }
            if let Err(e) = ws_tx.send(Message::text(line)).await {
                warn!("{}", e);
                break;
            }
        }
        debug!("Reader closed");
    });
    let read_ws = tokio::spawn(async move {
        while let Some(Ok(_)) = ws_rx.next().await {}
        use tokio::io::AsyncWriteExt;
        writer.write_all(b"close\n").await.ok();
        debug!("Writer closed");
    });
    let _ = future::join(read_tty, read_ws).await;
    info!("Closed");
}
