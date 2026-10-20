package com.booking.bookingapi.dto;

import com.booking.bookingapi.entity.Booking;
import com.booking.bookingapi.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookingResponse(
        Long id,
        Long roomId,
        String roomNumber,
        String propertyName,
        String guestName,
        String guestEmail,
        String guestPhone,
        LocalDate checkIn,
        LocalDate checkOut,
        BookingStatus status,
        BigDecimal totalPrice
) {
    public static BookingResponse from(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getRoom().getId(),
                b.getRoom().getNumber(),
                b.getRoom().getProperty().getName(),
                b.getGuestFirstName() + " " + b.getGuestLastName(),
                b.getGuestEmail(),
                b.getGuestPhone(),
                b.getCheckIn(),
                b.getCheckOut(),
                b.getStatus(),
                b.getTotalPrice()
        );
    }
}