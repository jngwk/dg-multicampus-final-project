package com.dg.deukgeun.dto;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import lombok.Builder;
import lombok.Data;

@Data
public class PageResponseDTO<E> {
    private List<E> dtoList; // 현재 페이지의 데이터 전송 객체 목록
    private List<Integer> pageNumList; // 표시할 페이지 번호 목록
    private PageRequestDTO pageRequestDTO; // 요청된 페이지 정보
    private boolean prev; // 이전 페이지 링크가 있는지 여부
    private boolean next; // 다음 페이지 링크가 있는지 여부
    private int totalCount; // 총 항목 수
    private int prevPage; // 이전 페이지 번호
    private int nextPage; // 다음 페이지 번호
    private int totalPage; // 총 페이지 수
    private int current; // 현재 페이지 번호

    @Builder(builderMethodName = "withAll")
    public PageResponseDTO(List<E> dtoList, PageRequestDTO pageRequestDTO, long totalCount){
        this.dtoList = dtoList; // 데이터 전송 객체 목록 설정
        this.pageRequestDTO = pageRequestDTO; // 페이지 요청 정보 설정
        this.totalCount = (int) totalCount; // 총 항목 수 설정

        // 현재 페이지를 기준으로 끝 페이지 번호 계산
        int end = (int)(Math.ceil(pageRequestDTO.getPage() / 10.0)) * 10;
        // 끝 페이지를 기준으로 시작 페이지 번호 계산
        int start = end - 9;
        // 총 항목 수와 페이지 크기를 기준으로 마지막 페이지 번호 계산
        int last = (int)(Math.ceil(totalCount / (double)pageRequestDTO.getSize()));

        // 끝 페이지가 마지막 페이지를 초과하면 끝 페이지 조정
        end = end > last ? last : end;

        // 시작 페이지가 1보다 크면 이전 페이지가 존재
        this.prev = start > 1;
        // 총 항목 수가 끝 페이지의 항목 수를 초과하면 다음 페이지가 존재
        this.next = totalCount > end * pageRequestDTO.getSize();

        // 표시할 페이지 번호 목록 생성
        this.pageNumList = IntStream.rangeClosed(start, end).boxed().collect(Collectors.toList());

        // 이전 페이지가 존재하면 이전 페이지 번호 설정
        if (prev) {
            this.prevPage = start - 1;
        }

        // 다음 페이지가 존재하면 다음 페이지 번호 설정
        if (next) {
            this.nextPage = end + 1;
        }

        // 현재 페이지 범위 내 총 페이지 수 설정
        this.totalPage = this.pageNumList.size();

        // 현재 페이지 번호 설정
        this.current = pageRequestDTO.getPage();
    }
}
