package com.dg.deukgeun.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dg.deukgeun.dto.WorkoutSessionDTO;
import com.dg.deukgeun.entity.WorkoutSession;

@Configuration
public class RootConfig {
    @Bean
    public ModelMapper getMapper(){
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
        .setFieldMatchingEnabled(true)
        .setFieldAccessLevel(org.modelmapper.config
        .Configuration.AccessLevel.PRIVATE)
        .setMatchingStrategy(MatchingStrategies.LOOSE);
        modelMapper.addMappings(new PropertyMap<WorkoutSessionDTO, WorkoutSession>() {
            @Override
            protected void configure() {
                map().setUser(source.getPtSession().getPt().getUser());
            }
        });
        return modelMapper;
    }
}
