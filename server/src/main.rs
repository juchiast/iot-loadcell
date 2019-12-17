#[macro_use]
extern crate log;

mod tty;
mod tty_discover;
mod ws;

#[derive(Debug)]
pub enum Error {
    CantOpenTTY,
}

pub type Result<T> = std::result::Result<T, crate::Error>;

#[tokio::main]
async fn main() {
    env_logger::init();

    let routes = ws::route();
    warp::serve(routes).run(([127, 0, 0, 1], 8080)).await;
}
