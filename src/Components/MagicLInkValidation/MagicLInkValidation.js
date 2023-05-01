import '../../pages/signin/signin.scss'
import {
    Form,
    Button,
    Heading,
    FormLabel
} from '@carbon/react';
import {
    TextInput,
    InlineLoading,
    ToastNotification,
    Link
} from 'carbon-components-react';
import { Loader } from '../Loader/Loader';
import { ArrowRight, ArrowLeft } from '@carbon/react/icons';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
const MagicLinkValidation = ({ heading, loading, loadingSucess, handleFormSubmit, errorNotification, labelText, labelValue, setFormLabelState, buttonText, text, subtitle, setSignInPhaseOne, showCreateAccount, createAccoutText, navigationUrl, navigationUrlText, placeholderText, setErrorNotification, setServerErrorNotification, serverErrorNotification, handleEmailFormSubmit }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className='signin-container' >
                <div className='box-container'>
                    <Form onSubmit={handleFormSubmit}>
                        <div style={{ paddingRight: '20px' }}>
                            <Heading style={{ fontSize: '28px',fontWeight:'400' }}>{heading}</Heading>
                            <p className="register-text body-01">{text}<Link className="underlined-link" style={{ cursor: 'pointer', paddingLeft: '4px', textDecoration: 'underline' }} onClick={() => { setSignInPhaseOne(true);setServerErrorNotification({ }); }}> {subtitle}</Link></p>
                            {typeof serverErrorNotification == 'object' && Object.keys(serverErrorNotification).length !== 0 ?
                                (
                                    <div className='notification-container'>
                                        <ToastNotification
                                            className='toast-notification'
                                            iconDescription="describes the close button"
                                            subtitle={serverErrorNotification?.title}
                                            timeout={0}
                                            title={""}
                                            kind={serverErrorNotification?.status}
                                            onCloseButtonClick={() => { setErrorNotification({}); setServerErrorNotification({}) }}
                                        />
                                    </div>) : (
                                    <div></div>
                                )
                            }
                            <div className='login-input-wrapper' >
                                <FormLabel className='input-label' >{labelText}</FormLabel>
                                <TextInput
                                    id="security-code"
                                    className="login-form-input"
                                    hideLabel={true}
                                    invalid={typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0}
                                    labelText=""
                                    invalidText={(errorNotification && errorNotification.title) ? errorNotification.title : ""}
                                    placeholder={placeholderText}
                                    disabled={loading ? true : false}
                                    value={labelValue}
                                    onChange={e => { setFormLabelState(e.target.value); if (typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0) setErrorNotification({}); setServerErrorNotification({}); }}
                                />
                                <div className='resend-code'>
                                    {loadingSucess ?
                                        (<div >
                                            <InlineLoading description={'resending security code...'} className="submit-button-loading" />
                                        </div>) :
                                        (<p className='resend-code-text' onClick={handleEmailFormSubmit}>Resend security code</p>)}
                                </div>
                            </div>
                        </div>
                        <div className='fields-container'>
                            {loading ?
                                (<div className='loader-signin'>
                                    <InlineLoading description={'Please wait...'} className="submit-button-loading" />
                                </div>) :
                                (<Button
                                    renderIcon={ArrowRight}
                                    type="submit"
                                    iconDescription={""}
                                    size="xl"
                                    className="submit-button"
                                >{buttonText}</Button>)}
                        </div>
                        <div className='footer-container'>
                            {showCreateAccount && <p className="register-text-body-01">{createAccoutText}<Link style={{ cursor: 'pointer', textDecoration: 'underline', paddingLeft: '4px', outline: 'none' }} className="underlined-link" href={`${navigationUrl}`}> {navigationUrlText}</Link></p>}
                        </div>
                    </Form>
                </div>
                <div className='footer-text'>
                    <p className="register-text-body-01">{"Need help?"}<Link style={{ cursor: 'pointer', textDecoration: 'underline', paddingLeft: '4px', outline: 'none' }} className="underlined-link" href={`signin`}> {"Contact the Bynar help desk"}</Link></p>
                </div>
            </div>
        </>
    )
}
export default MagicLinkValidation;