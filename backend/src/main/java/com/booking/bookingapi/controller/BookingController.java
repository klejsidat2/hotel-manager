package com.booking.bookingapi.controller;

import com.booking.bookingapi.dto.BookingRequest;
import com.booking.bookingapi.dto.BookingResponse;
import com.booking.bookingapi.entity.BookingStatus;
import com.booking.bookingapi.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @GetMapping
    public List<BookingResponse> list(@RequestParam(required = false) Long roomId) {
        return roomId != null ? service.findByRoom(roomId) : service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse create(@Valid @RequestBody BookingRequest req) {
        return service.create(req);
    }

    @PatchMapping("/{id}/status")
    public BookingResponse updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.updateStatus(id, BookingStatus.valueOf(body.get("status")));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}