# Changelog

All notable changes to this project will be documented in this file. This project uses [Pride versioning](https://pridever.org/).

## [Unreleased]

### Upcoming features

This section describes a roadmap to turn \*NixConnect into an MVP (Minimum Viable Product), that is, version 1.0.0.

- **Settings** - design for the settings page with different categories
- **User account management** - users can delete their accounts and change various information (except nickname)
- **Colour scheme** - users can change colour schemes
- **Admin role** - administrator account has extra privileges over the rest of the network, it can be extended to other accounts
- **Single-click post interaction** - user can left-click a post and interact with it using the options in the statusbar
- **Comments to posts** - user can add comments to posts in very much the same way
- **More info in the post** - more information about the post can be viewed in the post (number of pings, number of comments, clicking on each shows details)
- **Soft delete** - implement soft delete mechanisms
- **Rich text editing for posts and comments** - users can use rich-text editing options when making a post or a comment
- **Database-level security enforcements** - properly implement the RLS policies in the tables
- **Image upload in posts** - upload images in posts
- **Story/gallery posts** - upload posts with a carousel of images
- **Hashtags** - users will be able to use hashtags and search posts with the hashtags
- **Search** - users will be able to search for content of the posts and users

## [0.2.3] - 2025-04-01

### Added

- **Search entries** - search entries now work, and can be selected to make a search

### Fixed

- **Mobile navigation optimizations** - header and footer navigation elements have been embiggened on touchscreens
- **Default colour scheme on logout** - colour scheme is properly reset after user logs out
- **Better colour scheme performance** - improved performance of loading and selecting colour schemes
- **Hide irrelevant options in context menu** - irrelevant/unathorized actions are now hidden from the context menus
- **Colour scheme in Markdown documents** - colour scheme is applied properly in Markdown documents
- **Tweaks in 'View' page** - simplified API, bug fixes

## [0.2.2] - 2025-03-24

### Added

- **More icons** - there are now even more icons present in more places in the UI (including context menus)
- **Colour schemes** - users can now choose from the four colour schemes in _Settings_ - _Personalization_

### Changed

- **Soft delete** - posts are now soft deleted, they are removed from the feed and the search results, they are still accessible under a link for the general audiences
- **Refactoring** - some components were refactored

### Fixed

- **Bugs when changing user data** - user validation now works properly
- **Proper redirections** - unauthenticated users are now properly redirected to login, authenticated users are prevented from logging in again
- **RLS implementations (partial)** - there are partial RLS implementations in place to secure the app even more

## [0.2.1] - 2025-03-21

### Added

- **Icons** - some new graphical icons to better illustrate certain tasks
- **Settings** - there is currently a design in place for Settings
- **Change user data** - authenticated users can now change their avatars and emails

### Changed

- **Refactoring** - some components were refactored, as \*NixConnect's visual identity is being established

## [0.2] - 2025-03-08

### Added

- **Comments** - users can add comments and interact with them in a similar way to posts; right click on a comment to see the context menu
- **Revamped View** - the view post section has been revamped to better suit the large space available

### Changed

- **Version handle** - version handle is now more prominent in the bottom bar, clicking it opens the changelog
- **Refactoring and refinements** - redoing the code structure and refining some parts of the user experience

## [0.1.3] - 2025-03-08

### Added

- **Double-click to ping** - you can double click a post to ping it

### Changed

- **New ping experience** - you can see the number of pings in the post and interact with them in real time, users can view ping information on all posts

### Fixed

- **Ping bug** - pings are now deleted properly
- **Ping/Unping toggle** - you will now see toggled options for pinging posts
- **Refactoring** - profile pictures are now easier to implement, and there are no warnings during build

## [0.1.2] - 2025-03-06

### Changed

- **Refactoring** - light refactoring and lots of unused code has been removed

### Added

- **Full site search** - authenticated users can now search for other users on the network, as well as contents of some posts
- **System logging** - first use of the unified logging system

## [0.1.1] - 2025-03-04

### Changed

- **Changelog removed from About** - all of the Changelog details are now available here
- **ENV Versioning** - current version of \*NixConnect is available from a global source and in the About section

## [0.1] - 2025-03-03

### Added

- **Roadmap to MVP** - there is a clear plan on what features to implement to \*NixConnect to reach the MVP status

### Changed

- **Documentation changes** - we have changed the way documentation is displayed and on the site, and have separated the Changelog from About into this file
- **Formatting changes** - headers are formatted differently (`h3` is formatted as a larger text), and in documentation files they are prepended by symbolic pound signs

## [0.0.9] - 2025-02-27

### Added

- **Profile user** - authenticated users can view their profiles by selecting their user handle and clicking on Profile

### Changed

- **User Navigation menu** - the user handle in the top right now opens a navigation with options

### Fixed

- **Project structure** - Refactoring and solifidication of project's structure

## [0.0.8] - 2025-02-18

### Added

- **Toast messages** - toast messages are displayed on the bottom right when user performs certain actions
- **Test integration** - integration of tests on the backend

### Fixed

- **Infinite loading** - Infinite loading of posts in the feed and user profiles

## [0.0.7] - 2025-02-10

### Added

- **Skeleton loading** - posts in the feed are now loaded asynchronously, and a skeleton is presented during the load procedure

### Changed

- **Shrink long posts** - shrinking very long posts (posts can be expanded)

## [0.0.6] - 2025-02-07

### Fixed

- **Pinging** -
  Pinging posts actually works now

## [0.0.5] - 2025-02-06

### Added

- **Interactable posts** -
  Posts can now be interacted with in basic ways (pinging, viewing, copying). To interact with a post, right-click on it.
- **Code blocks in posts** - new code blocks in posts

## [0.0.4] - 2025-02-05

### Fixed

- **Font fix** -
  Fix the special character handling for the font

## [0.0.3] - 2025-02-04

### Added

- **Basic authentication** -
  Users can now register and log in using password authentication

### Fixed

- **Form validation** - There is a great deal of form validation in place

## [0.0.2] - 2025-02-01

### Added

- **User profiles** -
  Addition of user profiles, avatars are now properly integrated with the user's profile

## [0.0.1] - 2025-01-31

### Added

- **\*NixConnect is starting its journey!** -
  \*NixConnect only supports GitHub authentication for the time being, there are no validations on the server side, please keep that in mind. There's a lot more to come!
