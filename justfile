# Load in `.env`
set dotenv-load

export PATH := './target/bin:' + env_var('PATH')
TARGET_DIR := './target/wasm32-unknown-unknown/release'
CONTRACT_ID := 'e643875683a4bf960fbf1bd9f6610ede4a3518052b6cb60014dd7605b48c488a'
SMARTDEPLOY := TARGET_DIR / 'smartdeploy.wasm'
soroban := 'target/bin/soroban'

@setup:
    echo {{ if path_exists(soroban) == "true" { "" } else { `cargo install_soroban` } }}
    echo {{ if path_exists(SMARTDEPLOY) == "true" { "" } else { `just fetch` } }}    

soroban +args:
    @soroban {{args}}

# Execute plugin
s name +args:
    @just soroban {{ name }} {{ args }}

# build profile='release':
#     cargo build --profile {{profile}} --target wasm32-unknown-unknown

build_generated:
    cd target/js-clients/smartdeploy && npm i && npm run build

clean_generated:
    rm -rf node_modules/smartdeploy && rm -rf node_modules/.vite && rm -rf node_modules/.astro 

install_generated: clean_generated
    npm i -S smartdeploy@./target/js-clients/smartdeploy

fetch:
    @just soroban contract fetch --network futurenet --id {{ CONTRACT_ID }} --out-file {{ SMARTDEPLOY }}
    

generate: setup && install_generated
    ./target/bin/soroban contract bindings ts \
        --wasm {{ SMARTDEPLOY }} \
        --id {{ CONTRACT_ID }} \
        --root-dir ./target/js-clients/smartdeploy \
        --rpc-url "https://rpc-futurenet.stellar.org:443/soroban/rpc" \
        --network-passphrase "Test SDF Future Network ; October 2022" \
        --contract-name smartdeploy

dev: generate
    npm run dev

[private]
setup_default:
   @soroban config identity generate -d default --config-dir $CONFIG_DIR


@setup-node:
    npm i


# Delete non-wasm artifacts
@clean:
    rm -rf .soroban/*.json target/bin/soroban-*

rust:
  #!/usr/bin/env rust-script
    fn main() {
        println!("Hello, world!");
    }
