import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export type LinkOptions = {
	source: string;
	target: string;
	dryRun?: boolean;
	backup?: boolean;
	root?: boolean;
};

function expandHome(p: string) {
	return p.startsWith("~") ? path.join(process.env.HOME || "", p.slice(1)) : p;
}

function ensureDir(dir: string, dryRun: boolean) {
	if (dryRun) return;
	fs.mkdirSync(dir, { recursive: true });
}

/* -------------------------------------------------------
 * 1) listDir — получить элементы верхнего уровня
 * -----------------------------------------------------*/
export function listDir(dir: string): string[] {
	const abs = path.resolve(expandHome(dir));
	if (!fs.existsSync(abs)) throw new Error(`Not found: ${abs}`);

	return fs
		.readdirSync(abs, { withFileTypes: true })
		.map((e) => path.join(abs, e.name));
}

/* -------------------------------------------------------
 * internal — создать безопасный бэкап
 * -----------------------------------------------------*/
function makeBackup(src: string, dry: boolean) {
	const stamp = new Date().toISOString().replace(/[:.]/g, "-");
	const rnd = Math.random().toString(36).slice(2, 8);
	const backup = `${src}.backup-${stamp}-${rnd}`;

	if (dry) {
		console.log(`[dry] backup ${src} -> ${backup}`);
	} else {
		fs.renameSync(src, backup);
	}

	return backup;
}

/* -------------------------------------------------------
 * internal — создать симлинк
 * -----------------------------------------------------*/
function createSymlink(
	src: string,
	dest: string,
	isDir: boolean,
	dry: boolean,
	useSudo: boolean,
) {
	const rel = path.relative(path.dirname(dest), src);

	if (dry) {
		console.log(`[dry] ln -s ${rel} ${dest}`);
		return;
	}

	if (useSudo) {
		const result = child_process.spawnSync("sudo", ["ln", "-s", rel, dest], {
			stdio: "inherit",
		});
		if (result.status !== 0) {
			throw new Error(`sudo ln failed`);
		}
		return;
	}

	// обычный вариант
	try {
		if (isDir) {
			fs.symlinkSync(
				rel,
				dest,
				process.platform === "win32" ? "junction" : "dir",
			);
		} else {
			fs.symlinkSync(rel, dest);
		}
	} catch {
		fs.symlinkSync(rel, dest);
	}
}

/* -------------------------------------------------------
 * 2) linkToDir — создать симлинк source -> targetDir
 * -----------------------------------------------------*/
export function stow(opts: LinkOptions) {
	const dry = !!opts.dryRun;
	const doBackup = !!opts.backup;
	const useSudo = !!opts.root;

	const src = path.resolve(expandHome(opts.source));
	const tgtDir = path.resolve(expandHome(opts.target));

	if (!fs.existsSync(src)) throw new Error(`Source not found: ${src}`);
	ensureDir(tgtDir, dry);

	const name = path.basename(src);
	const dest = path.join(tgtDir, name);

	// если уже существует
	if (fs.existsSync(dest)) {
		const st = fs.lstatSync(dest);

		if (st.isSymbolicLink()) {
			const link = fs.readlinkSync(dest);
			const abs = path.resolve(path.dirname(dest), link);

			if (abs === src) {
				console.log(`OK: correct symlink exists ${dest}`);
				return;
			}

			// неправильный симлинк → удаляем
			if (dry) console.log(`[dry] unlink wrong symlink ${dest}`);
			else fs.unlinkSync(dest);
		} else {
			// обычный файл/папка
			if (doBackup) {
				makeBackup(dest, dry);
			} else {
				if (dry) console.log(`[dry] remove ${dest}`);
				else fs.rmSync(dest, { recursive: true, force: true });
			}
		}
	}

	const isDir = fs.lstatSync(src).isDirectory();
	createSymlink(src, dest, isDir, dry, useSudo);

	if (!dry) console.log(`linked: ${dest}`);
}
