import './ForgotPassword.scss'
export const ForgotPasswordStrengthChecker = ({ passwordArray }) => {
    const arr = ["8 characters", "one uppercase", "one lowercase", "one number", "one special character", "no space "];
    return (
        <div className="popup-new" >
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