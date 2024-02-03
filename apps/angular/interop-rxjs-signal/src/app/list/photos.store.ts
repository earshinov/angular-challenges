import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Photo } from '../photo.model';
import { PhotoService } from '../photos.service';

const PHOTO_STATE_KEY = 'photo_search';

interface LocalStorageData {
  search: string;
  page: number;
}

@Injectable()
export class PhotoStore {
  private photoService = inject(PhotoService);

  private _photos = signal([] as Photo[]);
  private _searchTerm = signal('');
  private _page = signal(1);
  private _pages = signal(1);
  private _loading = signal(false);
  private _error = signal<unknown>('');

  photos = this._photos.asReadonly();
  searchTerm = this._searchTerm.asReadonly();
  page = this._page.asReadonly();
  pages = this._pages.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  endOfPage = computed(() => this._page() === this._pages());

  constructor() {
    const savedJSONState = localStorage.getItem(PHOTO_STATE_KEY);
    if (savedJSONState) {
      const savedState = JSON.parse(savedJSONState) as LocalStorageData;
      this._searchTerm.set(savedState.search);
      this._page.set(savedState.page);
    }

    this.searchPhotos().pipe(takeUntilDestroyed()).subscribe();
  }

  search(searchTerm: string) {
    this._searchTerm.set(searchTerm);
    this._page.set(1);
  }

  nextPage() {
    this._page.set(Math.min(this._page() + 1, this._pages()));
  }

  previousPage() {
    this._page.set(Math.max(this._page() - 1, 1));
  }

  private searchPhotos(): Observable<void> {
    return toObservable(
      computed(() => ({ search: this._searchTerm(), page: this._page() })),
    ).pipe(
      filter(({ search }) => search.length >= 3),
      switchMap(({ search, page }) => {
        this._loading.set(true);
        this._error.set('');
        return this.photoService.searchPublicPhotos(search, page).pipe(
          tap({
            next: ({ photos: { photo, pages } }) => {
              this._loading.set(false);
              this._photos.set(photo);
              this._pages.set(pages);

              const savedState: LocalStorageData = { search, page };
              localStorage.setItem(PHOTO_STATE_KEY, JSON.stringify(savedState));
            },
            error: (error: unknown) => {
              this._error.set(error);
              this._loading.set(false);
            },
          }),
          map(() => {}),
        );
      }),
    );
  }
}
