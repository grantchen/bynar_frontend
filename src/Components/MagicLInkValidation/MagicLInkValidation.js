import '../../pages/signin/signin.scss'
import {
    Form,
    Button,
    Heading,
    FormLabel,
    Link
} from '@carbon/react';
import { Loader } from '../Loader/Loader';
import OtpInput from 'react-otp-input';
const MagicLinkValidation = ({heading, loading,handleFormSubmit ,errorNotification, labelText, labelValue, setFormLabelState, buttonText ,text,subtitle,setSignInPhaseOne}) => {
    return (
        <>
            <div className='signin-container' >
                <div className='box-container'>
                    <Form onSubmit={handleFormSubmit}>
                        <div style={{ paddingRight: '20px' }}>
                            <Heading>{heading}</Heading>
                            <p className="register-text body-01">{text}<Link className="underlined-link" style={{ cursor: 'pointer' }} onClick={() => { setSignInPhaseOne(true) }}> {subtitle}</Link></p>
                            <div className='login-input-wrapper' >
                                <FormLabel className='input-label' >{labelText}</FormLabel>
                                <OtpInput
                                    value={labelValue}
                                    onChange={setFormLabelState}
                                    numInputs={6}
                                    renderSeparator={<span>-</span>}
                                    renderInput={(props) => <input {...props} />}
                                    inputStyle={{ width: '56px' }}
                                />
                                <div>
                                    {(errorNotification && errorNotification.title && labelValue.length == 0) ? <p style={{ color: '#DA1E28', fontSize: '12px', marginTop: '4px' }}>{errorNotification.title}</p> : ""}
                                </div>
                            </div>
                        </div>
                        <div className='fields-container'>
                            {loading ?
                                (<div className='loader-signin'>
                                    <Loader />
                                </div>) :
                                (<Button
                                    type="submit"
                                    iconDescription={""}
                                    size="xl"
                                    className="submit-button"
                                >{buttonText}</Button>)}
                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}
export default MagicLinkValidation;