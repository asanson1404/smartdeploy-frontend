const endpoints = {
    publish_events: process.env.NEXT_PUBLIC_PUBLISH_EVENTS_ENDPOINT ?? "",
    deploy_events: process.env.NEXT_PUBLIC_DEPLOY_EVENTS_ENDPOINT ?? "",
    subscribe_ledger_expiration: process.env.NEXT_PUBLIC_SUBSCRIBE_LEDGER_EXPIRATION_ENDPOINT ?? "",
    read_ttl: process.env.NEXT_PUBLIC_READ_LEDGER_TTL_ENDPOINT ?? "",
}

export default endpoints;
    