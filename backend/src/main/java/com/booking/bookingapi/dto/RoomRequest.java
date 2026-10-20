package com.booking.bookingapi.dto;

import com.booking.bookingapi.entity.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record RoomRequest(
        @NotBlank String number,
        @NotNull RoomType type,
        @NotNull @Positive BigDecimal pricePerNight,
        String description,
        String descriptionEn,
        @NotNull Long propertyId
) {}