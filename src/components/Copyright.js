const Copyright = () => {
    const currentYear = new Date().getFullYear();

    return (
        <p className="uk-text-muted">© {currentYear} SmartDeploy. All rights reserved.</p>
    );
};

export default Copyright;