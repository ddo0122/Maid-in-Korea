package com.example.backend.domain.cafe.repository;

import com.example.backend.domain.cafe.entity.Cafe;
import com.example.backend.domain.cafe.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findAllByCafe(Cafe cafe);

    Optional<Menu> findByIdAndCafe(Long id, Cafe cafe);
}
