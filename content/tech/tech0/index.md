---
title: Tech
date: 2024-05-27
ShowPostNavLinks: true
showHero: true
description: "Principles of Git."
tags: ["Git", "GitHub", "Git Bash", "Windows", "MacOS", "Linux", "Mac", "distributed", "Homebrew", "Terminal", "git clone", "git pull", "git push", "git add", "git commit"]
---
## "Principles of Git."
#### 05/27/2024 

Let's embark on a journey that takes you from the very first steps with Git to becoming proficient in its common use cases. Whether you're using Linux, MacOS or Windows, the techniques covered in these videos will be valid across all platforms, facilitated by Git Bash. Without further ado, let's delve into the world of Git.

To start, let's unravel the fundamental question: What is Git? Git is a distributed version control system, and the term "distributed" holds paramount significance. This sets Git apart from its predecessors like centralized systems such as SVN and CVS. In Git's distributed ecosystem, each computer that has downloaded the repository maintains a complete copy of it. This feature enables you to work independently without relying on a centralized server. This is a crucial contrast to centralized systems like SVN. Why do we need Git or any version control system? The answer is simple: tracking changes to files is complex, especially when working individually or in teams.

Imagine a scenario where you're crafting a web application composed of numerous files. After deploying it, you decide to make changes locally. Without version control, identifying which files were modified becomes challenging. Version control systems like Git address this problem. Consider collaborating with another developer. With Git, both of you can make changes to the same files without discord. Git handles merging changes seamlessly, resolving a common source of conflict.

Transitioning to Git installation, the process is straightforward across all platforms. For Linux users, you can obtain Git via your preferred package manager. MacOS users can utilize Homebrew, while Windows users can download Git from git-scm.org. During the Windows installation, opting for Git Bash is crucial to attain a consistent command-line experience similar to Linux and MacOS.

Git's role transcends version control; it's a software distribution medium. Platforms like GitLab and GitHub act as repositories, housing copies of projects. They often serve as master repositories, facilitating collaboration. While not mandatory, using these services streamlines sharing and synchronization.

Venturing into using Git, let's explore cloning repositories. Instead of merely downloading a zip file, the superior approach is using "git clone." By copying the URL, running "git clone [URL]" you mirror the repository onto your system. It not only fetches code but also initializes Git-specific components. This association ensures you can update your local copy with any changes made on GitHub using "git pull."

Finally, let's address creating repositories. Whether from existing code or a blank slate, the process remains consistent. Using "git init" in a folder initiates a Git repository. You can also create a new repository with a specified name using "git init [folder name]." This empowers you to manage both existing projects and new endeavors effectively.

You now comprehend the essence of Git, the role of repositories and how to install Git. Moreover, you've grasped how to clone repositories, making collaboration seamless and learned how to initialize your own repositories. This foundation equips you to traverse Git's landscape with confidence and proficiency.

https://git-scm.com/downloads
https://git-scm.com/docs
https://en.wikipedia.org/wiki/Git
https://en.wikipedia.org/wiki/GitHub