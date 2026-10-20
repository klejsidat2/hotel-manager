package com.booking.bookingapi.service;

import com.booking.bookingapi.dto.RoomRequest;
import com.booking.bookingapi.dto.RoomResponse;
import com.booking.bookingapi.entity.Property;
import com.booking.bookingapi.entity.Room;
import com.booking.bookingapi.entity.RoomPhoto;
import com.booking.bookingapi.exception.ConflictException;
import com.booking.bookingapi.exception.NotFoundException;
import com.booking.bookingapi.repository.BookingRepository;
import com.booking.bookingapi.repository.PropertyRepository;
import com.booking.bookingapi.repository.RoomPhotoRepository;
import com.booking.bookingapi.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class RoomService {

    private static final List<String> ALLOWED = List.of("jpg", "jpeg", "png", "webp", "gif");

    private final RoomRepository rooms;
    private final PropertyRepository properties;
    private final BookingRepository bookings;
    private final RoomPhotoRepository photos;
    private final Path uploadDir;

    public RoomService(RoomRepository rooms,
                       PropertyRepository properties,
                       BookingRepository bookings,
                       RoomPhotoRepository photos,
                       @Value("${app.upload-dir:uploads}") String uploadDir) {
        this.rooms = rooms;
        this.properties = properties;
        this.bookings = bookings;
        this.photos = photos;
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath();
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> findByProperty(Long propertyId) {
        return rooms.findByPropertyId(propertyId).stream().map(RoomResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public RoomResponse findOne(Long id) {
        return RoomResponse.from(find(id));
    }

    @Transactional
    public RoomResponse create(RoomRequest req) {
        Property property = properties.findById(req.propertyId())
                .orElseThrow(() -> new NotFoundException("Prona nuk ekziston"));

        Room room = new Room();
        room.setNumber(req.number().trim());
        room.setType(req.type());
        room.setPricePerNight(req.pricePerNight());
        room.setDescription(req.description());
        room.setDescriptionEn(req.descriptionEn());
        room.setProperty(property);

        return RoomResponse.from(rooms.save(room));
    }

    @Transactional
    public RoomResponse update(Long id, RoomRequest req) {
        Room room = find(id);
        room.setNumber(req.number().trim());
        room.setType(req.type());
        room.setPricePerNight(req.pricePerNight());
        room.setDescription(req.description());
        room.setDescriptionEn(req.descriptionEn());
        return RoomResponse.from(rooms.save(room));
    }

    @Transactional
    public void delete(Long id) {
        Room room = find(id);
        if (bookings.existsByRoomId(id)) {
            throw new ConflictException("Dhoma ka rezervime dhe nuk mund të fshihet");
        }
        List<String> files = room.getPhotos().stream().map(RoomPhoto::getFileName).toList();
        rooms.delete(room);
        files.forEach(this::deleteFile);
    }

    @Transactional
    public RoomResponse addPhotos(Long id, List<MultipartFile> files) {
        Room room = find(id);

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }
            String name = UUID.randomUUID() + "." + extension(file.getOriginalFilename());
            try {
                Files.createDirectories(uploadDir);
                file.transferTo(uploadDir.resolve(name));
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }

            RoomPhoto photo = new RoomPhoto();
            photo.setRoom(room);
            photo.setFileName(name);
            photos.save(photo);
            room.getPhotos().add(photo);
        }
        return RoomResponse.from(room);
    }

    @Transactional
    public RoomResponse deletePhoto(Long roomId, Long photoId) {
        Room room = find(roomId);
        RoomPhoto photo = room.getPhotos().stream()
                .filter(p -> p.getId().equals(photoId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Fotoja nuk ekziston"));

        room.getPhotos().remove(photo);
        deleteFile(photo.getFileName());
        return RoomResponse.from(room);
    }

    private Room find(Long id) {
        return rooms.findById(id).orElseThrow(() -> new NotFoundException("Dhoma nuk ekziston"));
    }

    private String extension(String original) {
        String name = original == null ? "" : original.toLowerCase();
        int dot = name.lastIndexOf('.');
        String ext = dot >= 0 ? name.substring(dot + 1) : "";
        if (!ALLOWED.contains(ext)) {
            throw new IllegalArgumentException("Lejohen vetëm foto: jpg, png, webp, gif");
        }
        return ext;
    }

    private void deleteFile(String fileName) {
        try {
            Files.deleteIfExists(uploadDir.resolve(fileName));
        } catch (IOException ignored) {
            // nëse skedari nuk fshihet, nuk e prishim kërkesën
        }
    }
}