package com.booking.bookingapi.repository;

import com.booking.bookingapi.entity.Booking;
import com.booking.bookingapi.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRoomId(Long roomId);

    @Query("""
            select count(b) > 0 from Booking b
            where b.room.id = :roomId
              and b.status <> :cancelled
              and b.checkIn < :checkOut
              and b.checkOut > :checkIn
            """)
    boolean existsOverlap(@Param("roomId") Long roomId,
                          @Param("checkIn") LocalDate checkIn,
                          @Param("checkOut") LocalDate checkOut,
                          @Param("cancelled") BookingStatus cancelled);
    List<Booking> findAllByOrderByIdDesc();
    boolean existsByRoomId(Long roomId);
}