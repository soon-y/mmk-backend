# MMK Shop - Backend

## Introduction
MMK Shop is a full-stack e-commerce demo built with a modular architecture. It provides a Shop frontend for customers, an Admin dashboard for management, a Backend server for handling business logic and APIs, and a Database for persistent data storage.

    ┌─────────────────┐         ┌──────────────────┐
    │ Shop (Frontend) │         │ Admin (Frontend) │
    └─────────────────┘         └──────────────────┘
              ▲                           ▲
              │  API Requests / Responses │ 
              └─────────────┬─────────────┘
                            ▼             
                  ┌──────────────────┐  
                  │ Backend (Server) │ 
                  └─────────┬────────┘
                            │ Read/Write Data
                            ▼
                    ┌────────────────┐
                    │    Database    │
                    └────────────────┘

## Features
* stores all data (products, customers, orders) in the database.
* provides APIs for both Shop and Admin to fetch or update data.
* secures the system with authentication & authorization.

## Tech Stack
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
