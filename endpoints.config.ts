const endpoints = {
    publish_events: process.env.NEXT_PUBLIC_PUBLISH_EVENTS_ENDPOINT ?? "",
    deploy_events: process.env.NEXT_PUBLIC_DEPLOY_EVENTS_ENDPOINT ?? "",
}

export default endpoints;
    