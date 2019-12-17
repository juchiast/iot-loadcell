#[macro_use]
extern crate log;

mod tty;
mod tty_discover;

use futures::prelude::*;

#[derive(Debug)]
pub enum Error {
    CantOpenTTY,
}

pub type Result<T> = std::result::Result<T, crate::Error>;

#[tokio::main]
async fn main() {
    env_logger::init();

    let mut rx = tty_discover::tty_discorver();

    while let Some(paths) = rx.next().await {
        if let Some(path) = paths.get(0) {
            let mut t = tty::TTY::open(path.clone()).await.unwrap();
            while let Some(maybe_line) = t.lines.next().await {
                if let Ok(line) = maybe_line {
                    println!("{}", line);
                }
            }
        }
    }
}
