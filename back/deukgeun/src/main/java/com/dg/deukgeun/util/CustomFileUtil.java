package com.dg.deukgeun.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.util.UUID;

@Component
@Log4j2
@RequiredArgsConstructor
public class CustomFileUtil {
    private final String uploadPath = "./images";
    @PostConstruct
    public void init(){
        File tempFolder = new File(uploadPath);
        if(tempFolder.exists()==false){
            tempFolder.mkdir();
        }
        log.info("--------------------");
        log.info(uploadPath);
    }
    public List<String> saveFile(List<MultipartFile> files) throws RuntimeException{
        if(files == null || files.size()==0){
            return List.of();
        }
        List<String> uploadNames = new ArrayList<>();
        for(MultipartFile multipartFile : files){
            String savedName = UUID.randomUUID().toString() + "_" + multipartFile.getOriginalFilename();
            Path savedPath = Paths.get(uploadPath,savedName);
            try{
                log.info("before copy");
                Files.copy(multipartFile.getInputStream(),savedPath);
                log.info("after copy");
                uploadNames.add(savedName);
            } catch(IOException e){
                log.info(e.getMessage());
                return new ArrayList<String>();
                // throw new RuntimeException(e.getMessage());
            }
        }
        return uploadNames;
    }
}
