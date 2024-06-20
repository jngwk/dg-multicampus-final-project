package com.dg.deukgeun.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dg.deukgeun.entity.Gym;
import com.dg.deukgeun.service.SearchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api")
public class SearchController {

    @Autowired
    private final SearchService searchService;

    @GetMapping("/search")
    public List<Gym> searchGyms(@RequestParam String keyword) {
        log.info("Searching for gyms with keyword: {}", keyword);
        return searchService.searchGyms(keyword);
    }
    
}
