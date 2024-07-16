# Project DeukGeun

[![ko](https://img.shields.io/badge/lang-ko-green.svg)](https://github.com/jngwk/dg-multicampus-final-project/blob/main/README.md)

## Usage
Create your account or use the test accounts shown below.

Link: [https://dgdg.o-r.kr:30115/](https://dgdg.o-r.kr:30115/)

### Test Accounts

**General User:**
- ID: user@gmail.com
- PWD: Xptmxm1234!

**Gym:**
- ID: dg@gmail.com
- PWD: Xptmxm1234!

**Trainer:**
- ID: trainer@gmail.com
- PWD: Xptmxm1234!

**Admin:**
- ID: admin
- PWD: Xptmxm1234!

## Introduction
A platform connecting gyms and trainers with individuals looking to work out.

## Purpose
Created to address the **issues** arising from the increasing demand for gyms.

### Problem 1: Inconvenience of in-person consultations for gym details and payments
- Utilizes KakaoMap's GeoCoder with HTTPS certification to recommend gyms based on the user's current location
- Enables quick consultations between gyms and users through real-time chat functionality
- Supports online payment for memberships/PT sessions using PortOne's payment API, offering various payment methods

### Problem 2: Difficulty in recording personal workouts or PT sessions
- In actual gyms, PT content is recorded on paper or using Excel
- Implements a PT calendar for trainers to record sessions and a workout journal feature for individuals to log their workouts

### Problem 3: Reluctance of individuals to expose personal information when communicating with trainers
- Many users prefer not to expose their personal information or be contacted for personal reasons
- Provides useful features like PT scheduling, diet management, and trainer schedule viewing through real-time chat without exposing personal information

### Problem 4: Data management difficulties due to the surge in gym users and challenges in attracting new members amid increasing gym supply
- Visualizes member data using ChartJS, providing valuable insights for gym operators
- Utilizes 'DeukGeun' for detailed gym information and real-time chat as an online marketing tool
- Offers membership expiration notifications using the @Scheduled annotation

## Key Features
- Gym search (Kakao Map API)
- Real-time chat (RabbitMQ, STOMP)
- Online membership/PT payment (PortOne API)
- Workout calendar (FullCalendar)
- Data visualization and insights using member data (ChartJS)

## Technologies Used
- Frontend implemented using React, JavaScript, and Tailwind
- Backend implemented using Spring Boot and Java
- Authorization & authentication implemented with Spring Security and JWT tokens
- Database built and utilized with MySQL and Spring Data JPA
- Deployment using Docker and Nginx
- HTTPS certification using CertBot and Let's Encrypt

_Written by jngwk_
