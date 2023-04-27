import '../../pages/signin/signin.scss'
import {
    Form,
    Button,
    Heading,
    FormLabel,
    Link
} from '@carbon/react';
import {
    TextInput,
    InlineLoading
} from 'carbon-components-react';
import { Loader } from '../Loader/Loader';
import { ArrowRight, ArrowLeft } from '@carbon/react/icons';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
const MagicLinkValidation = ({ heading, loading, handleFormSubmit, errorNotification, labelText, labelValue, setFormLabelState, buttonText, text, subtitle, setSignInPhaseOne, showCreateAccount, createAccoutText, navigationUrl, navigationUrlText, placeholderText, setErrorNotification, setServerErrorNotification }) => {
    const navigate = useNavigate();
    return (
        <>
            <div className='signin-container' >
                <div className='box-container'>
                    <Form onSubmit={handleFormSubmit}>
                        <div style={{ paddingRight: '20px' }}>
                            <Heading style={{ fontSize: '28px' }}>{heading}</Heading>
                            <p className="register-text body-01">{text}<Link className="underlined-link" style={{ cursor: 'pointer' }} onClick={() => { setSignInPhaseOne(true) }}> {subtitle}</Link></p>
                            <div className='login-input-wrapper' >
                                <FormLabel className='input-label' >{labelText}</FormLabel>
                                {/* <OtpInput
                                    value={labelValue}
                                    onChange={setFormLabelState}
                                    numInputs={6}
                                    renderSeparator={<span>-</span>}
                                    renderInput={(props) => <input {...props} />}
                                    inputStyle={{ width: '56px' }}
                                /> */}
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
                                {/* <div>
                                    {(errorNotification && errorNotification.title && labelValue.length == 0) ? <p style={{ color: '#DA1E28', fontSize: '12px', marginTop: '4px' }}>{errorNotification.title}</p> : ""}
                                </div> */}
                            </div>
                        </div>
                        <div className='fields-container'>
                            {loading ?
                                (<div className='loader-signin'>
                                    {/* <Loader /> */}
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
                            <hr />
                            {showCreateAccount && <p className="register-text-body-01">{createAccoutText}<Link style={{ cursor: 'pointer',textDecoration: 'underline' }} className="underlined-link" onClick={() => { navigate(`${navigationUrl}`) }}> {navigationUrlText}</Link></p>}
                        </div>
                    </Form>
                </div>
                <div className='footer-text'>
                    <p className="register-text-body-01">{"Need help?"}<Link style={{ cursor: 'pointer', textDecoration: 'underline', paddingLeft: '4px' }} className="underlined-link" onClick={() => { navigate(`/signin`) }}> {"Contact the Bynar help desk"}</Link></p>
                </div>
            </div>
        </>
    )
}
export default MagicLinkValidation;