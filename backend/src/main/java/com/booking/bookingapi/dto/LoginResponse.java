package com.booking.bookingapi.dto;

public record LoginResponse(
        String token,
        String name,
        String email,
        String role
) {}