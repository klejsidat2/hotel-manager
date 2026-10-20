package com.booking.bookingapi.dto;

import com.booking.bookingapi.entity.Room;
import com.booking.bookingapi.entity.RoomType;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.util.List;

public record RoomResponse(
        Long id,
        String number,
        RoomType type,
        BigDecimal pricePerNight,
        String description,
        String descriptionEn,
        Long propertyId,
        String propertyName,
        List<Photo> photos
) {
    public record Photo(Long id, String url) {}

    public static RoomResponse from(Room r) {
        List<Photo> photos = r.getPhotos().stream()
                .map(p -> new Photo(
                        p.getId(),
                        ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path("/uploads/")
                                .path(p.getFileName())
                                .toUriString()))
                .toList();

        return new RoomResponse(
                r.getId(),
                r.getNumber(),
                r.getType(),
                r.getPricePerNight(),
                r.getDescription(),
                r.getDescriptionEn(),
                r.getProperty().getId(),
                r.getProperty().getName(),
                photos
        );
    }
}