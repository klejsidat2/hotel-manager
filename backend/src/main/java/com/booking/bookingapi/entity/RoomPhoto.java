package com.booking.bookingapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "room_photos")
@Getter
@Setter
@NoArgsConstructor
public class RoomPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "file_name", nullable = false)
    private String fileName;
}