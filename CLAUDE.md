# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InnovaPACS (Med IQ) is an Angular 17 frontend for a RIS/PACS system targeting small medical clinics in Mexico. It integrates with:

- A Java/Spring Boot backend API at `https://persist.lat/med-iq-service`
- DCM4CHEE (open-source PACS for DICOM image storage)
- OHIF Viewer (web-based DICOM visualization)
- Kafka/HL7 messaging (handled by the backend, not this repo)
