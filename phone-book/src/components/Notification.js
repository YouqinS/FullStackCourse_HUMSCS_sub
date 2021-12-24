const Notification = ({notification}) => {
    if (notification === null || !notification.message) {
        return null
    } else {
        const className = notification.isError ? "error" : "notification";
        return (
            <div className={className}>
                {notification.message}
            </div>
        )
    }
}

export default Notification
