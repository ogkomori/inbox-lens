package com.komori.corefocus.dto;

import java.time.LocalDateTime;

public record CustomResponseBody(LocalDateTime timestamp,
                                 Integer statusCode,
                                 String message,
                                 Boolean success) {
}
