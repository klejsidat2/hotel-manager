package com.booking.bookingapi.repository;

import com.booking.bookingapi.entity.RoomPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomPhotoRepository extends JpaRepository<RoomPhoto, Long> {
}