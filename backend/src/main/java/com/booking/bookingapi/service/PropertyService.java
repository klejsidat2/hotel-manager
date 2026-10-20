package com.booking.bookingapi.service;

import com.booking.bookingapi.dto.PropertyRequest;
import com.booking.bookingapi.dto.PropertyResponse;
import com.booking.bookingapi.entity.Property;
import com.booking.bookingapi.exception.NotFoundException;
import com.booking.bookingapi.repository.PropertyRepository;
import com.booking.bookingapi.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository repository;
    private final UserRepository userRepository;

    public PropertyService(PropertyRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public List<PropertyResponse> findAll(String city) {
        var properties = (city == null || city.isBlank())
                ? repository.findAll()
                : repository.findByCityIgnoreCase(city);
        return properties.stream().map(PropertyResponse::from).toList();
    }

    public PropertyResponse create(PropertyRequest req) {
        var owner = userRepository.findById(req.ownerId())
                .orElseThrow(() -> new NotFoundException("Pronari nuk ekziston"));
        var p = new Property();
        p.setName(req.name());
        p.setCity(req.city());
        p.setCategory(req.category());
        p.setOwner(owner);
        return PropertyResponse.from(repository.save(p));
    }
}