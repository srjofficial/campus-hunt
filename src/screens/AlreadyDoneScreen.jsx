export default function AlreadyDoneScreen({ station }) {
    return (
        <div className="screen">
            <div className="info-container">
                <div className="info-icon">✅</div>
                <h2 className="info-title">{station?.name}</h2>
                <p className="info-sub">You've already completed this station!</p>
            </div>
        </div>
    );
}
