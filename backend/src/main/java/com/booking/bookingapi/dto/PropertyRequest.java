package com.booking.bookingapi.dto;

import com.booking.bookingapi.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PropertyRequest(
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Size(max = 100) String city,
        @NotNull Category category,
        @NotNull Long ownerId
) {}