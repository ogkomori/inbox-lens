package com.komori.inboxlens.exception;

public class OpenAIException extends RuntimeException {
  public OpenAIException(String message) {
    super(message);
  }
}
