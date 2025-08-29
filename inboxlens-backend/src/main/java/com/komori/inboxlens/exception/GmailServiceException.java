package com.komori.inboxlens.exception;

public class GmailServiceException extends RuntimeException {
    public GmailServiceException(String message) {
        super(message);
    }
    public GmailServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}
