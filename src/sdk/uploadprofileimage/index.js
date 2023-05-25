import React, {useState} from "react";
import {useAuth} from "../AuthContext";
import {BaseURL} from "../constant";
import {ImportModal} from "@carbon/ibm-products";

const UploadProfileImageModal = ({
                                     isUploadProfileImageModalOpen,
                                     openUploadProfileImageModal,
                                 }) => {
    const {authFetch,user} = useAuth()
    const props = {
        accept: ["image/jpeg", "image/png"],
        className: "test-class",
        defaultErrorBody: "Select a new file and try again.",
        defaultErrorHeader: "Import failed",
        description:
            "You can specify a file to import by either dragging it into the drag and drop area or by specifying a URL. (Maximum file size of 500KB; .jpg and .png file extensions only.)",
        fetchErrorBody: "Unable to fetch URL.",
        fetchErrorHeader: "Import failed",
        fileDropHeader: "Add files using drag and drop",
        fileDropLabel: "Drag and drop files here or click to upload",
        fileUploadLabel: "files uploaded",
        inputButtonText: "Add file",
        inputId: "test-id",
        inputLabel: "Add a file by specifying a URL",
        inputPlaceholder: "URL",
        invalidFileTypeErrorBody: "Invalid file type.",
        invalidFileTypeErrorHeader: "Import failed",
        invalidIconDescription: "Delete",
        maxFileSize: 500000,
        maxFileSizeErrorBody:
            "500kb max file size. Select a new file and try again.",
        maxFileSizeErrorHeader: "Import failed",
        onClose: () => openUploadProfileImageModal(false),
        onRequestSubmit: async (e) => {
            try {
                const formData = new FormData();
                formData.append(
                    "file",
                    e[0].fileData,
                );
                const response = await authFetch(`${BaseURL}/upload`, {
                    method: "POST",
                    contentType: "multipart/form-data",
                    body: formData,
                });
                if (response.ok) {
                     openUploadProfileImageModal(false)
                    // getUser();
                } else {
                    throw "error";
                }
            } catch (error) {
            } finally {
            }
        },
        open: isUploadProfileImageModalOpen,
        primaryButtonText: "Import",
        secondaryButtonText: "Cancel",
        title: "Import"
    };

    return (
        <>
            <ImportModal {...props} />
        </>
    );
};
export default UploadProfileImageModal