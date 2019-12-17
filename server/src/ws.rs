use futures::future;
use futures::prelude::*;
use warp::filters::ws::Message;
use warp::filters::ws::WebSocket;
use warp::reject::Rejection;
use warp::Filter;

pub fn route() -> impl Filter<Extract = impl warp::reply::Reply, Error = Rejection> {
    warp::path!("dev" / String)
        .and(warp::ws())
        .map(|s, ws: warp::ws::Ws| ws.on_upgrade(move |websocket| ws_handle(s, websocket)))
}

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

    let read_tty = tokio::spawn(async move {
        while let Some(maybe_line) = tty.lines.next().await {
            if let Err(e) = maybe_line {
                warn!("{}", e);
                break;
            }
            let line = maybe_line.unwrap();
            if let Err(e) = ws_tx.send(Message::text(line)).await {
                warn!("{}", e);
                break;
            }
        }
    });
    let read_ws = tokio::spawn(async move { while ws_rx.next().await.is_some() {} });
    let _ = future::join(read_tty, read_ws).await;
    info!("Closed");
}
