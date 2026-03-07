export default function NoStationScreen() {
    const handleReset = () => {
        location.reload();
    };

    return (
        <div className="screen">
            <div className="info-container">
                <div className="info-icon">🔍</div>
                <h1 className="info-title">Campus Hunt</h1>
                <p className="info-sub">Scan a station QR code to begin your adventure!</p>
                <button className="btn-danger" onClick={handleReset}>Reset Progress</button>
            </div>
        </div>
    );
}
