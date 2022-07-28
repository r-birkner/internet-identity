pub struct Ass {
    pub content: &'static [u8],
    pub sha256: [u8; 32],
    pub transform: Ta,

}

pub enum Ta {
    Identity,
    Gzip
}
