package com.booking.bookingapi.service;

import com.booking.bookingapi.dto.BookingRequest;
import com.booking.bookingapi.dto.BookingResponse;
import com.booking.bookingapi.entity.Booking;
import com.booking.bookingapi.entity.BookingStatus;
import com.booking.bookingapi.entity.Room;
import com.booking.bookingapi.exception.ConflictException;
import com.booking.bookingapi.exception.NotFoundException;
import com.booking.bookingapi.repository.BookingRepository;
import com.booking.bookingapi.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookings;
    private final RoomRepository rooms;

    public BookingService(BookingRepository bookings, RoomRepository rooms) {
        this.bookings = bookings;
        this.rooms = rooms;
    }

    public List<BookingResponse> findByRoom(Long roomId) {
        return bookings.findByRoomId(roomId).stream().map(BookingResponse::from).toList();
    }

    public BookingResponse create(BookingRequest req) {
        if (!req.checkOut().isAfter(req.checkIn())) {
            throw new IllegalArgumentException("Data e daljes duhet të jetë pas hyrjes");
        }

        Room room = rooms.findById(req.roomId())
                .orElseThrow(() -> new NotFoundException("Dhoma nuk ekziston"));

        if (bookings.existsOverlap(room.getId(), req.checkIn(), req.checkOut(), BookingStatus.CANCELLED)) {
            throw new ConflictException("Dhoma është e zënë në ato data");
        }

        long nights = ChronoUnit.DAYS.between(req.checkIn(), req.checkOut());

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setGuestFirstName(req.firstName().trim());
        booking.setGuestLastName(req.lastName().trim());
        booking.setGuestEmail(req.email().trim());
        booking.setGuestPhone(req.phone().trim());
        booking.setCheckIn(req.checkIn());
        booking.setCheckOut(req.checkOut());
        booking.setStatus(BookingStatus.PENDING);
        booking.setTotalPrice(room.getPricePerNight().multiply(BigDecimal.valueOf(nights)));

        return BookingResponse.from(bookings.save(booking));
    }
    public List<BookingResponse> findAll() {
        return bookings.findAllByOrderByIdDesc().stream().map(BookingResponse::from).toList();
    }

    public BookingResponse updateStatus(Long id, BookingStatus status) {
        Booking booking = bookings.findById(id)
                .orElseThrow(() -> new NotFoundException("Rezervimi nuk ekziston"));
        booking.setStatus(status);
        return BookingResponse.from(bookings.save(booking));
    }

    public void delete(Long id) {
        if (!bookings.existsById(id)) {
            throw new NotFoundException("Rezervimi nuk ekziston");
        }
        bookings.deleteById(id);
    }
}