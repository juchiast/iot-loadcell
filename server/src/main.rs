#[macro_use]
extern crate log;

mod error;
mod tty_discover;

use futures::prelude::*;

#[tokio::main]
async fn main() {
    env_logger::init();

    let mut rx = tty_discover::tty_discorver();

    while let Some(name) = rx.next().await {
        println!("{:?}", name);
    }
}

/*
fn main() {
    let mut ser =
        serialport::posix::TTYPort::open(Path::new("/dev/ttyUSB0"), &Default::default()).unwrap();
    use std::io::Read;
    use std::io::Write;
    let mut buf = [0u8; 256];
    loop {
        while let Ok(size) = ser.read(&mut buf) {
            if size == 0 {
                break;
            }
            let s = std::str::from_utf8(&buf[..size]);
            if let Ok(s) = s {
                let f: f32 = s.trim().parse().unwrap();
                println!("{}", f);
            }
        }
    }
}
*/
