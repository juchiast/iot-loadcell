#[macro_use]
extern crate log;

mod tty;
mod tty_discover;
mod ws;

#[derive(Debug)]
pub enum Error {
    CantOpenTTY,
    CantWriteTTY,
    NoHandshake,
}

pub type Result<T> = std::result::Result<T, crate::Error>;

use warp::Filter;

#[tokio::main]
async fn main() {
    env_logger::init();

    let cors = warp::cors::cors().allow_any_origin();

    let ws = warp::path!("dev" / String)
        .and(warp::ws())
        .map(|s, ws: warp::ws::Ws| ws.on_upgrade(move |websocket| ws::ws_handle(s, websocket)));

    let devs = warp::path("dev")
        .and_then(tty_discover::tty_discover);

    let routes = ws.or(devs);
    warp::serve(routes.with(cors))
        .run(([127, 0, 0, 1], 8080))
        .await;
}
