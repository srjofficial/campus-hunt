export default function WaitingScreen({ station }) {
    return (
        <div className="screen">
            <div className="info-container">
                <div className="info-icon">📱</div>
                <h2 className="info-title">Station Complete!</h2>
                <p className="info-sub">
                    Follow the clue to the next station and scan its QR code to continue your hunt!
                </p>
                <div className="info-clue-box">{station?.nextClue}</div>
            </div>
        </div>
    );
}
