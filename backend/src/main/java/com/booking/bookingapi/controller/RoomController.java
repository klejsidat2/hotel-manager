package com.booking.bookingapi.controller;

import com.booking.bookingapi.dto.RoomRequest;
import com.booking.bookingapi.dto.RoomResponse;
import com.booking.bookingapi.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    @GetMapping
    public List<RoomResponse> list(@RequestParam Long propertyId) {
        return service.findByProperty(propertyId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoomResponse create(@Valid @RequestBody RoomRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public RoomResponse update(@PathVariable Long id, @Valid @RequestBody RoomRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping("/{id}/photos")
    public RoomResponse addPhotos(@PathVariable Long id,
                                  @RequestParam("files") List<MultipartFile> files) {
        return service.addPhotos(id, files);
    }

    @DeleteMapping("/{id}/photos/{photoId}")
    public RoomResponse deletePhoto(@PathVariable Long id, @PathVariable Long photoId) {
        return service.deletePhoto(id, photoId);
    }
    @GetMapping("/{id}")
    public RoomResponse get(@PathVariable Long id) {
        return service.findOne(id);
    }
}