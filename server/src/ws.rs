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

async fn try_send(r: Result<String, tokio::io::Error>, ws: &mut WebSocket) -> Result<(), Box<str>> {
    let line = r.map_err(|e| e.to_string().into_boxed_str())?;
    let value = line
        .parse::<f64>()
        .map_err(|e| e.to_string().into_boxed_str())?;
    let msg = serde_json::json!({ "value": value });
    ws.send(Message::text(serde_json::to_string(&msg).unwrap()))
        .await
        .map_err(|e| e.to_string().into_boxed_str())?;
    Ok(())
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

    while let Some(maybe_line) = tty.lines.next().await {
        if let Err(e) = try_send(maybe_line, &mut ws).await {
            warn!("Error: {}", e);
        }
    }
}
