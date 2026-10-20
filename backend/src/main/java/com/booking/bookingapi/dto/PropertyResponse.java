package com.booking.bookingapi.dto;

import com.booking.bookingapi.entity.Category;
import com.booking.bookingapi.entity.Property;

public record PropertyResponse(
        Long id,
        String name,
        String city,
        Category category,
        String ownerName
) {
    public static PropertyResponse from(Property p) {
        return new PropertyResponse(
                p.getId(),
                p.getName(),
                p.getCity(),
                p.getCategory(),
                p.getOwner().getName()
        );
    }
}