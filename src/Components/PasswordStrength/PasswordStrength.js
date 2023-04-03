import './PasswordStrength.scss'
export const PasswordStrength = ({ passwordArray }) => {
    const arr = ["8 characters", "one uppercase", "one lowercase", "one number", "one special character", "no space "];
    return (
        <div className="popup" >
            {passwordArray.map((item, index) => (
                <div key={index} className="list">
                    {item ? (<div className="circle">
                        <div className="checkmark"></div>
                    </div>) : (<div className="circle-inactive">
                        <div className="checkmark-inactive"></div></div>)}
                    <p style={{ paddingLeft: '32px', padding: '4px', width: '100%' }}>{arr[index]}</p>
                </div>
            ))}

        </div>
    )
}