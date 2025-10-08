# ReVanced other

Some internals are still uncategorized but noteworthy.

## Consistency

ReVanced maintains a couple of repositories on GitHub. However, often, repositories share similar structures, code or style. Since a handful of maintainers work on these repositories separately, inconsistencies can occur. For this reason, from time to time, similarities between repositories are identified and kept consistent. Examples include CI, readmes, documentation, dependencies, build systems, code-style or repository settings. Consistency allows ReVanced to apply changes across repositories in bulk via a single source of truth and reduce technical debt with an increasing size and amount of repositories. Consistency also reduces disruption of users and contributors navigating across repositories in ReVanced.

## Modularity

ReVanced is designed with modularity. ReVanced Manager and ReVanced CLI allow using any set of patches for example. You can configure ReVanced Manager to use a different API and use APK downloaders of your choice. Patches are modular as well, so that each patch can be developed, maintained and used separately. Modularity prevents centralization, as you can use ReVanced with your own choice of modules. Our distribution of our tools like ReVanced Manager are configured to default to our distribution of modules, like our patches or API. Someone elses distribution could configure their modules. Modular design also allows decoupling systems, code and isolating problem spaces. This ensures development of one module does not disturb another which eases the maintenance and development of ReVanced. Designing with modularity in mind is not easy and can be accidentally done incorrectly, yet it is an important attribute of ReVanced.

## Conventions

### Comments

Comments should conventionally conform a valid English sentence. This means, starting comments with an uppercase letter and ending them punctuation. Sometimes comments only consist out of a single word, in which case, the word should start with an uppercase letter and end with a punctuation, unless it is a specific term. Some examples of comments include:

- // A regular comment should be a sentence.
- // Word.
- // terminology.

### Naming

Abbreviations should not be used to mitigate unreadable or obfuscated code, as well as to increase consistency. Examples that are okay:

- val home = Home()
- val methodInstructions = method.instructions
- val instructions = fingerprint.method.instructions
- val instructionIndex = instruction.index
- val index = instruction.index

In contrast, examples that are not okay:

- val h = Home()
- val mInsn = method.instructions
- val ins = fingerprint.method.instructions
- val instructionIdx = instruction.index
- val idx = instruction.index

Long names may be shortened without abbreviation, e.g., instead of "someClassFingerprintMethodInstructionIndex", just "index" may be used. Shortening variable names should be done according to contextual requirements. Expressive variable names that explain what they are should be used. For example, instead of just "index", the variable name "returnIndex" would be favorable in the case it refers to an index where something is returned. Depending on the context, to avoid redundancy, "index" may also be fine, however this needs to be weighted on a case-by-case basis.

This kind of naming scheme should be reflected on class, method, field and even outside of code, e.g., in documentations, announcements, readmes and more.

### Abstraction

Especially patches may have repetitive patterns, e.g., manifest patches that replace some attribute are mostly similar to each other, differing only in the attribute. In such cases it is very important to abstract code in a way so it can be shared. Duplicate code should be avoided to mitigate tech debt.

### Emojis

ReVanced uses emojis in documentation and other various places, e.g., document titles, readmes or similar.