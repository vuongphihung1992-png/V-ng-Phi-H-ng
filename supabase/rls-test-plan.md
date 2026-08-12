# RLS (ROW LEVEL SECURITY) TEST PLAN

## System Security Principles
- **Public Users**:
  - [x] CANNOT read any `profiles` or `audit_logs` records.
  - [x] CANNOT SELECT full records from `security_reports`, `report_attachments`, or `appointments`.
  - [x] CAN ONLY query specific report or appointment status by exact `code` + `phone` via Security-Definer RPC functions (`track_report`, `track_appointment`).
  - [x] CAN INSERT new `security_reports`, `appointments`, and `feedback`.
  - [x] CAN SELECT published `news`, `announcements`, `faqs`, and `banners`.

- **STAFF Users**:
  - [x] CAN SELECT and UPDATE `security_reports`, `appointments`, and `feedback`.
  - [x] CAN INSERT `report_updates` and `notifications`.
  - [x] CANNOT modify roles or manage user profiles.

- **EDITOR Users**:
  - [x] CAN CREATE, UPDATE, DELETE `news`, `announcements`, `faqs`, and `banners`.
  - [x] CAN upload images to the `news-images` bucket.

- **ADMIN / SUPER_ADMIN Users**:
  - [x] CAN manage all profiles, roles, settings, and view `audit_logs`.
  - [x] CAN bypass lower role restrictions to handle unit-wide escalations.
