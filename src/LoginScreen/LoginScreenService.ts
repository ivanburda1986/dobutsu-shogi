import React from "react";
import {useLoginUser} from "../api/firestore";

interface onRequestPasswordResetInterface {
    email: string | undefined;
    requestPasswordReset: ({email}: { email: string }) => void;
    callback: (newValue: boolean) => void;
}

export const onRequestPasswordReset = ({
                                           email,
                                           requestPasswordReset,
                                           callback
                                       }: onRequestPasswordResetInterface) => {
    if (email) {
        requestPasswordReset({email: email});
        callback(true);
        setTimeout(() => {
            callback(false);
        }, 3000);
    }
};


export const validatePasswordInputLength = (password: string | undefined): boolean => {
    if (password) {
        return password.length >= 1;
    }
    return false;
};

