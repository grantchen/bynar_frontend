import React, { useState, forwardRef, useEffect } from "react";
import { Add } from "@carbon/react/icons";
import {
    ComposedModal,
    ModalHeader,
    ModalFooter,
    ModalBody,
    FileUploaderDropContainer,
    FileUploaderItem,
    TextInput,
    Button,
    usePrefix,
} from "@carbon/react";
import cx from "classnames";
import PropTypes from "prop-types";
import { useAuth } from "../AuthContext";
import { BaseURL } from "../constant";

import { uuidv4 } from "../util";

import { pkg } from "@carbon/ibm-products";
import { async } from "@carbon/themes";
import { InlineLoading } from "carbon-components-react";
const componentName = "ImportModal";

// Default values for props
const defaults = {
    accept: Object.freeze([]),
};

export let ImportModal = forwardRef(
    (
        {
            // The component props, in alphabetical order (for consistency).

            accept = defaults.accept,
            className,
            defaultErrorBody,
            defaultErrorHeader,
            description,
            fetchErrorBody,
            fetchErrorHeader,
            fileDropHeader,
            fileDropLabel,
            fileUploadLabel,
            inputButtonIcon,
            inputButtonText,
            inputId,
            inputLabel,
            inputPlaceholder,
            invalidFileTypeErrorBody,
            invalidFileTypeErrorHeader,
            invalidIconDescription,
            maxFileSize,
            maxFileSizeErrorBody,
            maxFileSizeErrorHeader,
            onClose,
            onRequestSubmit,
            open,
            primaryButtonText,
            secondaryButtonText,
            title,

            // Collect any other property values passed in.
            ...rest
        },
        ref
    ) => {
        const { user, getUser, authFetch } = useAuth();
        const carbonPrefix = usePrefix();
        const [files, setFiles] = useState([]);
        const [importUrl, setImportUrl] = useState();
        const [fileChanged, setFileChange] = useState(false);
        const [loading, setLoading] = useState(false);
        useEffect(() => {
            if (!open) return;
            if (!user?.profileURL) return;
            if (user?.profileURL) {
                const blob = new Blob([]);
                const fetchedFile = new File([blob], user?.profileURL, {
                    type: blob.type,
                });
                fetchedFile.status = "edit";
                setFiles([fetchedFile]);
            }
            setImportUrl(user?.profileURL ?? "");
            // fetchFile(undefined, user?.profileURL)
        }, [user?.profileURL, open]);

        useEffect(() => {
            if(!open){
                setFiles([])
                setFileChange(false)
            }
        },[open])

        const isInvalidFileType = (file) => {
            const acceptSet = new Set(accept);
            const name = file.name;
            const mimeType = file.type;
            const extension = `.${name.split(".").pop()}`;
            if (
                acceptSet.has(mimeType) ||
                acceptSet.has(extension) ||
                accept.length === 0
            ) {
                return false;
            }
            return true;
        };

        const updateFiles = (newFiles) => {
            const updatedFiles = newFiles.map((file) => {
                const newFile = {
                    uuid: file.uuid || uuidv4(),
                    status: "edit",
                    iconDescription: invalidIconDescription,
                    name: file.name,
                    fileSize: file.size,
                    invalidFileType: file.invalidFileType,
                    fileData: file,
                    fetchError: file.fetchError,
                };
                if (newFile.fetchError) {
                    newFile.errorBody = fetchErrorBody || defaultErrorBody;
                    newFile.errorSubject =
                        fetchErrorHeader || defaultErrorHeader;
                    newFile.invalid = true;
                } else if (newFile.invalidFileType) {
                    newFile.errorBody =
                        invalidFileTypeErrorBody || defaultErrorBody;
                    newFile.errorSubject =
                        invalidFileTypeErrorHeader || defaultErrorHeader;
                    newFile.invalid = true;
                } else if (maxFileSize && newFile.fileSize > maxFileSize) {
                    newFile.errorBody =
                        maxFileSizeErrorBody || defaultErrorBody;
                    newFile.errorSubject =
                        maxFileSizeErrorHeader || defaultErrorHeader;
                    newFile.invalid = true;
                }
                return newFile;
            });
            const finalFiles = [...updatedFiles];
            setFiles(finalFiles);
        };

        const fetchFile = async (evt, url) => {
            evt?.preventDefault();
            const fileName =
                url ??
                importUrl
                    .substring(url ?? importUrl.lastIndexOf("/") + 1)
                    .split("?")[0];
            const pendingFile = {
                name: fileName,
                status: "uploading",
                uuid: uuidv4(),
            };
            setFiles([pendingFile]);
            try {
                const response = await fetch(url ?? importUrl);
                if (!response.ok || response.status !== 200) {
                    throw new Error(response.status);
                }
                const blob = await response.blob();
                const fetchedFile = new File([blob], fileName, {
                    type: blob.type,
                });
                fetchedFile.invalidFileType = isInvalidFileType(fetchedFile);
                fetchedFile.uuid = pendingFile.uuid;
                updateFiles([fetchedFile]);
            } catch (err) {
                const failedFile = {
                    ...pendingFile,
                    fetchError: true,
                };
                updateFiles([failedFile]);
            }
        };

        const onAddFile = (evt, { addedFiles }) => {
            evt.stopPropagation();
            updateFiles(addedFiles);
        };

        const onRemoveFile = (uuid) => {
            setFileChange(true);
            const updatedFiles = files.filter((f) => f.uuid !== uuid);
            setFiles(updatedFiles);

            setImportUrl("");
        };

        const onSubmitHandler = async () => {
            try {
                setLoading(true);
                if (files?.length > 0) {
                    await onRequestSubmit(files);
                } else {
                    if (user?.profileURL) {
                        const response = await authFetch(
                            `${BaseURL}/profile-image`,
                            {
                                method: "DELETE",
                            }
                        );
                        if (response.ok) {
                            await getUser();
                            onClose();
                        }
                    }
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        const inputHandler = (evt) => {
            setImportUrl(evt.target.value);
        };

        const numberOfFiles = files.length;
        const numberOfValidFiles = files.filter((f) => !f.invalid).length;
        const hasFiles = numberOfFiles > 0;
        const primaryButtonDisabled = user?.profileURL
            ? !fileChanged
            : !hasFiles || !(numberOfValidFiles > 0);
        const importButtonDisabled = !importUrl || hasFiles;
        const fileStatusString = `${numberOfValidFiles} / ${numberOfFiles} ${fileUploadLabel}`;
        const blockClass = `${pkg.prefix}--import-modal`;

        return (
            <ComposedModal
                {...rest}
                {...{ open, ref, onClose }}
                aria-label={title}
                className={cx(blockClass, className)}
                size="sm"
                preventCloseOnClickOutside
            >
                <ModalHeader
                    className={`${blockClass}__header`}
                    title={title}
                    closeClassName="display-none"
                />
                <ModalBody className={`${blockClass}__body-container`}>
                    {description && (
                        <p className={`${blockClass}__body`}>{description}</p>
                    )}
                    {fileDropHeader && (
                        <p className={`${blockClass}__file-drop-header`}>
                            {fileDropHeader}
                        </p>
                    )}
                    <FileUploaderDropContainer
                        accept={accept}
                        labelText={fileDropLabel}
                        onAddFiles={onAddFile}
                        disabled={hasFiles}
                        data-modal-primary-focus
                    />
                    {inputLabel && (
                        <p className={`${blockClass}__label`}>{inputLabel}</p>
                    )}
                    <div className={`${blockClass}__input-group`}>
                        <TextInput
                            labelText=""
                            id={inputId}
                            onChange={inputHandler}
                            placeholder={inputPlaceholder}
                            value={importUrl}
                            disabled={hasFiles}
                            aria-label={inputLabel}
                        />
                        <Button
                            onClick={fetchFile}
                            className={`${blockClass}__import-button`}
                            size="sm"
                            disabled={importButtonDisabled}
                            renderIcon={
                                inputButtonIcon
                                    ? (props) => <Add size={20} {...props} />
                                    : null
                            }
                        >
                            {inputButtonText}
                        </Button>
                    </div>
                    <div
                        className={`${carbonPrefix}--file-container ${blockClass}__file-container`}
                    >
                        {hasFiles && (
                            <p className={`${blockClass}__helper-text`}>
                                {fileStatusString}
                            </p>
                        )}
                        {files.map((file) => (
                            <FileUploaderItem
                                key={file.uuid}
                                onDelete={() => onRemoveFile(file.uuid)}
                                name={file.name}
                                status={file.status}
                                size="lg"
                                uuid={file.uuid}
                                iconDescription={file.iconDescription}
                                invalid={file.invalid}
                                errorBody={file.errorBody}
                                errorSubject={file.errorSubject}
                                filesize={
                                    file.fileSize /* cspell:disable-line */
                                }
                            />
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter className={`${blockClass}__footer`}>
                    <Button type="button" kind="secondary" onClick={onClose}>
                        {secondaryButtonText}
                    </Button>
                    <Button
                        type="submit"
                        kind="primary"
                        onClick={onSubmitHandler}
                        disabled={primaryButtonDisabled}
                        className="button-with-loading"
                    >
                        {primaryButtonText}
                        {loading && (
                            <InlineLoading className="inline-loading-within-btn" />
                        )}
                    </Button>
                </ModalFooter>
            </ComposedModal>
        );
    }
);

// Return a placeholder if not released and not enabled by feature flag
ImportModal = pkg.checkComponentEnabled(ImportModal, componentName);

ImportModal.propTypes = {
    /**
     * Specifies the file types that are valid for importing
     */
    accept: PropTypes.array,
    /**
     * Optional class name
     */
    className: PropTypes.string,
    /**
     * The default message shown for an import error
     */
    defaultErrorBody: PropTypes.string.isRequired,
    /**
     * The default header that is displayed to show an error message
     */
    defaultErrorHeader: PropTypes.string.isRequired,
    /**
     * Content that is displayed inside the modal
     */
    description: PropTypes.string,
    /**
     * Optional error body to display specifically for a fetch error
     */
    fetchErrorBody: PropTypes.string,
    /**
     * Optional error header to display specifically for a fetch error
     */
    fetchErrorHeader: PropTypes.string,
    /**
     * Header for the drag and drop box
     */
    fileDropHeader: PropTypes.string,
    /**
     * Label for the drag and drop box
     */
    fileDropLabel: PropTypes.string,
    /**
     * Label that appears when a file is uploaded to show number of files (1 / 1)
     */
    fileUploadLabel: PropTypes.string,
    /**
     * Button icon for import by url button
     */
    inputButtonIcon: PropTypes.bool,
    /**
     * Button text for import by url button
     */
    inputButtonText: PropTypes.string.isRequired,
    /**
     * ID for text input
     */
    inputId: PropTypes.string,
    /**
     * Header to display above import by url
     */
    inputLabel: PropTypes.string,
    /**
     * Placeholder for text input
     */
    inputPlaceholder: PropTypes.string,
    /**
     * Optional error message to display specifically for a invalid file type error
     */
    invalidFileTypeErrorBody: PropTypes.string,
    /**
     * Optional error header to display specifically for a invalid file type error
     */
    invalidFileTypeErrorHeader: PropTypes.string,
    /**
     * Description for delete file icon
     */
    invalidIconDescription: PropTypes.string,
    /**
     * File size limit in bytes
     */
    maxFileSize: PropTypes.number,
    /**
     * Optional error message to display specifically for a max file size error
     */
    maxFileSizeErrorBody: PropTypes.string,
    /**
     * Optional error header to display specifically for a max file size error
     */
    maxFileSizeErrorHeader: PropTypes.string,
    /**
     * Specify a handler for closing modal
     */
    onClose: PropTypes.func,
    /**
     * Specify a handler for "submitting" modal. Access the imported file via `file => {}`
     */
    onRequestSubmit: PropTypes.func,
    /**
     * Specify whether the Modal is currently open
     */
    open: PropTypes.bool,
    /**
     * Specify the text for the primary button
     */
    primaryButtonText: PropTypes.string.isRequired,
    /**
     * Specify the text for the secondary button
     */
    secondaryButtonText: PropTypes.string.isRequired,
    /**
     * The text displayed at the top of the modal
     */
    title: PropTypes.string.isRequired,
};

ImportModal.displayName = componentName;
